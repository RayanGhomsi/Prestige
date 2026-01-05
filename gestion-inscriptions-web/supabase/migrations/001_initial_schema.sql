-- Script d'initialisation de la base de données pour le système de gestion des inscriptions
-- À exécuter dans le SQL Editor de Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: parents
CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: classes
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL UNIQUE,
    niveau VARCHAR(50) NOT NULL,
    capacite_max INTEGER NOT NULL DEFAULT 30,
    effectif_actuel INTEGER NOT NULL DEFAULT 0,
    inscriptions_ouvertes BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: demandes_inscription
CREATE TABLE IF NOT EXISTS demandes_inscription (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_demande VARCHAR(50) NOT NULL UNIQUE,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
    classe_souhaitee VARCHAR(100) NOT NULL,
    date_soumission TIMESTAMP WITH TIME ZONE,
    date_derniere_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    traite_par UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_statut CHECK (statut IN ('en_attente', 'en_cours', 'documents_manquants', 'acceptee', 'refusee'))
);

-- Table: eleves
CREATE TABLE IF NOT EXISTS eleves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demande_id UUID REFERENCES demandes_inscription(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    lieu_naissance VARCHAR(200) NOT NULL,
    sexe CHAR(1) NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_sexe CHECK (sexe IN ('M', 'F'))
);

-- Table: informations_parents
CREATE TABLE IF NOT EXISTS informations_parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demande_id UUID REFERENCES demandes_inscription(id) ON DELETE CASCADE,
    pere_nom VARCHAR(100) NOT NULL,
    pere_prenom VARCHAR(100) NOT NULL,
    pere_profession VARCHAR(200) NOT NULL,
    pere_telephone VARCHAR(20) NOT NULL,
    pere_email VARCHAR(255) NOT NULL,
    mere_nom VARCHAR(100) NOT NULL,
    mere_prenom VARCHAR(100) NOT NULL,
    mere_profession VARCHAR(200) NOT NULL,
    mere_telephone VARCHAR(20) NOT NULL,
    mere_email VARCHAR(255) NOT NULL,
    tuteur_nom VARCHAR(100),
    tuteur_prenom VARCHAR(100),
    tuteur_lien VARCHAR(100),
    tuteur_telephone VARCHAR(20),
    adresse_complete TEXT NOT NULL,
    urgence_nom VARCHAR(200) NOT NULL,
    urgence_telephone VARCHAR(20) NOT NULL,
    urgence_lien VARCHAR(100) NOT NULL
);

-- Table: informations_medicales
CREATE TABLE IF NOT EXISTS informations_medicales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demande_id UUID REFERENCES demandes_inscription(id) ON DELETE CASCADE,
    groupe_sanguin VARCHAR(10) NOT NULL,
    allergies TEXT,
    maladies_chroniques TEXT,
    traitements_en_cours TEXT,
    medecin_nom VARCHAR(200) NOT NULL,
    medecin_telephone VARCHAR(20) NOT NULL
);

-- Table: documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demande_id UUID REFERENCES demandes_inscription(id) ON DELETE CASCADE,
    type_document VARCHAR(50) NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    url_storage TEXT NOT NULL,
    taille_fichier INTEGER NOT NULL,
    date_upload TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(20) NOT NULL,
    CONSTRAINT chk_type_document CHECK (type_document IN ('acte_naissance', 'certificat_vaccination', 'bulletins', 'justificatif_domicile', 'autre')),
    CONSTRAINT chk_uploaded_by CHECK (uploaded_by IN ('parent', 'admin'))
);

-- Table: historique_statuts
CREATE TABLE IF NOT EXISTS historique_statuts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demande_id UUID REFERENCES demandes_inscription(id) ON DELETE CASCADE,
    ancien_statut VARCHAR(50) NOT NULL,
    nouveau_statut VARCHAR(50) NOT NULL,
    commentaire TEXT,
    modifie_par UUID REFERENCES auth.users(id),
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demande_id UUID REFERENCES demandes_inscription(id) ON DELETE CASCADE,
    expediteur_type VARCHAR(20) NOT NULL,
    expediteur_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    date_envoi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_expediteur_type CHECK (expediteur_type IN ('parent', 'admin'))
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    titre VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info',
    lu BOOLEAN DEFAULT FALSE,
    lien TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_type CHECK (type IN ('info', 'success', 'warning', 'error'))
);

-- Table: sync_log (pour synchronisation desktop)
CREATE TABLE IF NOT EXISTS sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100) NOT NULL,
    dernier_sync TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statut_sync VARCHAR(20) NOT NULL,
    erreurs JSON
);

-- Indexes pour améliorer les performances
CREATE INDEX idx_parents_user_id ON parents(user_id);
CREATE INDEX idx_parents_email ON parents(email);
CREATE INDEX idx_demandes_parent_id ON demandes_inscription(parent_id);
CREATE INDEX idx_demandes_statut ON demandes_inscription(statut);
CREATE INDEX idx_demandes_numero ON demandes_inscription(numero_demande);
CREATE INDEX idx_eleves_demande_id ON eleves(demande_id);
CREATE INDEX idx_documents_demande_id ON documents(demande_id);
CREATE INDEX idx_historique_demande_id ON historique_statuts(demande_id);
CREATE INDEX idx_messages_demande_id ON messages(demande_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_lu ON notifications(lu);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demandes_updated_at BEFORE UPDATE ON demandes_inscription FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eleves_updated_at BEFORE UPDATE ON eleves FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes_inscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE eleves ENABLE ROW LEVEL SECURITY;
ALTER TABLE informations_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE informations_medicales ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE historique_statuts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies RLS pour parents
CREATE POLICY "Parents can view their own profile" ON parents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Parents can update their own profile" ON parents FOR UPDATE USING (auth.uid() = user_id);

-- Policies RLS pour demandes_inscription
CREATE POLICY "Parents can view their own demandes" ON demandes_inscription FOR SELECT USING (
    parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
);
CREATE POLICY "Parents can insert their own demandes" ON demandes_inscription FOR INSERT WITH CHECK (
    parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
);
CREATE POLICY "Parents can update their own demandes" ON demandes_inscription FOR UPDATE USING (
    parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
);

-- Policies RLS pour eleves
CREATE POLICY "Parents can view eleves of their demandes" ON eleves FOR SELECT USING (
    demande_id IN (
        SELECT id FROM demandes_inscription WHERE parent_id IN (
            SELECT id FROM parents WHERE user_id = auth.uid()
        )
    )
);

-- Policies RLS pour documents
CREATE POLICY "Parents can view documents of their demandes" ON documents FOR SELECT USING (
    demande_id IN (
        SELECT id FROM demandes_inscription WHERE parent_id IN (
            SELECT id FROM parents WHERE user_id = auth.uid()
        )
    )
);
CREATE POLICY "Parents can insert documents to their demandes" ON documents FOR INSERT WITH CHECK (
    demande_id IN (
        SELECT id FROM demandes_inscription WHERE parent_id IN (
            SELECT id FROM parents WHERE user_id = auth.uid()
        )
    )
);

-- Policies RLS pour notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Insertion des classes de base
INSERT INTO classes (nom, niveau, capacite_max) VALUES
('Maternelle Petite Section', 'Maternelle', 25),
('Maternelle Moyenne Section', 'Maternelle', 25),
('Maternelle Grande Section', 'Maternelle', 25),
('CP', 'Primaire', 30),
('CE1', 'Primaire', 30),
('CE2', 'Primaire', 30),
('CM1', 'Primaire', 30),
('CM2', 'Primaire', 30)
ON CONFLICT (nom) DO NOTHING;

-- Fonction pour générer un numéro de demande unique
CREATE OR REPLACE FUNCTION generate_numero_demande()
RETURNS TEXT AS $$
DECLARE
    year TEXT;
    random_num TEXT;
BEGIN
    year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    random_num := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN 'INS-' || year || '-' || random_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le numéro de demande
CREATE OR REPLACE FUNCTION set_numero_demande()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_demande IS NULL OR NEW.numero_demande = '' THEN
        NEW.numero_demande := generate_numero_demande();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_demande_numero BEFORE INSERT ON demandes_inscription
FOR EACH ROW EXECUTE FUNCTION set_numero_demande();

-- Trigger pour créer une notification lors du changement de statut
CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS TRIGGER AS $$
DECLARE
    parent_user_id UUID;
    titre TEXT;
    message TEXT;
BEGIN
    -- Récupérer le user_id du parent
    SELECT user_id INTO parent_user_id
    FROM parents
    WHERE id = NEW.parent_id;

    -- Définir le message selon le nouveau statut
    CASE NEW.statut
        WHEN 'en_cours' THEN
            titre := 'Demande en cours d''examen';
            message := 'Votre demande d''inscription n°' || NEW.numero_demande || ' est en cours d''examen par notre équipe.';
        WHEN 'documents_manquants' THEN
            titre := 'Documents manquants';
            message := 'Des documents sont manquants pour la demande n°' || NEW.numero_demande || '. Veuillez les ajouter depuis votre tableau de bord.';
        WHEN 'acceptee' THEN
            titre := 'Demande acceptée !';
            message := 'Félicitations ! Votre demande d''inscription n°' || NEW.numero_demande || ' a été acceptée.';
        WHEN 'refusee' THEN
            titre := 'Demande refusée';
            message := 'Votre demande d''inscription n°' || NEW.numero_demande || ' a été refusée. Consultez les détails dans votre tableau de bord.';
        ELSE
            RETURN NEW;
    END CASE;

    -- Créer la notification
    INSERT INTO notifications (user_id, titre, message, type, lien)
    VALUES (
        parent_user_id,
        titre,
        message,
        CASE NEW.statut
            WHEN 'acceptee' THEN 'success'
            WHEN 'refusee' THEN 'error'
            WHEN 'documents_manquants' THEN 'warning'
            ELSE 'info'
        END,
        '/demandes/' || NEW.id
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_status_change
AFTER UPDATE OF statut ON demandes_inscription
FOR EACH ROW
WHEN (OLD.statut IS DISTINCT FROM NEW.statut)
EXECUTE FUNCTION notify_status_change();

-- Commentaires pour documentation
COMMENT ON TABLE parents IS 'Table des profils parents liée à auth.users';
COMMENT ON TABLE demandes_inscription IS 'Table principale des demandes d''inscription';
COMMENT ON TABLE classes IS 'Table de configuration des classes disponibles';
COMMENT ON TABLE eleves IS 'Informations des élèves à inscrire';
COMMENT ON TABLE documents IS 'Documents uploadés pour les demandes';
COMMENT ON TABLE notifications IS 'Notifications en temps réel pour les utilisateurs';
