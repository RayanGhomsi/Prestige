-- Trigger pour créer automatiquement un profil parent lors de l'inscription
-- À exécuter APRÈS 001_initial_schema.sql

-- Fonction pour créer le profil parent automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.parents (user_id, nom, prenom, telephone, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nom', ''),
        COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
        COALESCE(NEW.raw_user_meta_data->>'telephone', ''),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Parents can view their own profile" ON parents;
DROP POLICY IF EXISTS "Parents can update their own profile" ON parents;
DROP POLICY IF EXISTS "Service role can insert parents" ON parents;

-- Policies RLS pour parents
CREATE POLICY "Parents can view their own profile" ON parents 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Parents can update their own profile" ON parents 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow insert for new users" ON parents 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
