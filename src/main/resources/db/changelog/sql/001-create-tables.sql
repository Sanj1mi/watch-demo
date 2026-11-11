CREATE TABLE person (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        first_name VARCHAR(128) NOT NULL,
                        last_name VARCHAR(128) NOT NULL,
                        age INTEGER NOT NULL,
                        department VARCHAR(128),

                        type VARCHAR(31) NOT NULL CHECK (type IN ('PATIENT', 'DOC', 'NURSE')),

                        specialty VARCHAR(128),
                        license VARCHAR(64),
                        salary NUMERIC(12, 2),
                        shift VARCHAR(64),
                        qualification VARCHAR(128),
                        diagnosis TEXT,
                        insurance_num VARCHAR(128),

                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_person_updated_at
    BEFORE UPDATE ON person
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

