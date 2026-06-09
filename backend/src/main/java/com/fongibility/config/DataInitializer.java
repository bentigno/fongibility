package com.fongibility.config;

import com.fongibility.entity.*;
import com.fongibility.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private ProgrammeRepository programmeRepository;

    @Autowired
    private ActionRepository actionRepository;

    @Autowired
    private ActiviteRepository activiteRepository;

    @Autowired
    private CategorieDepenseRepository categorieDepenseRepository;

    @Autowired
    private NatureEconomiqueRepository natureEconomiqueRepository;

    @Autowired
    private ChapitreRepository chapitreRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (sectionRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Créer les rôles
        Role roleOperateur = new Role();
        roleOperateur.setNom("OPERATEUR_SAISIE");
        roleOperateur.setDescription("Opérateur de saisie");
        roleRepository.save(roleOperateur);

        Role roleResponsable = new Role();
        roleResponsable.setNom("RESPONSABLE_FONCTION");
        roleResponsable.setDescription("Responsable de fonction financière");
        roleRepository.save(roleResponsable);

        Role roleAdmin = new Role();
        roleAdmin.setNom("ADMIN");
        roleAdmin.setDescription("Administrateur");
        roleRepository.save(roleAdmin);

        // Créer une section
        Section section = new Section();
        section.setCode("50");
        section.setLibelle("Ministère de l'Éducation Nationale");
        section.setAbreviation("MIN_ED");
        section.setDateEffet(LocalDate.of(2026, 1, 1));
        section.setValide(true);
        section.setType("MINISTERE");
        section = sectionRepository.save(section);

        // Créer des programmes
        Programme programme1 = new Programme();
        programme1.setCode("2056");
        programme1.setLibelle("Enseignements secondaire général");
        programme1.setSection(section);
        programme1.setDateEffet(LocalDate.of(2026, 1, 1));
        programme1.setStatut("ACTIF");
        programme1.setValidite("VALIDE");
        programme1.setDescription("Programme pour l'enseignement secondaire");
        programme1 = programmeRepository.save(programme1);

        Programme programme2 = new Programme();
        programme2.setCode("2081");
        programme2.setLibelle("Enseignement supérieur");
        programme2.setSection(section);
        programme2.setDateEffet(LocalDate.of(2026, 1, 1));
        programme2.setStatut("ACTIF");
        programme2.setValidite("VALIDE");
        programme2 = programmeRepository.save(programme2);

        // Créer des actions
        Action action1 = new Action();
        action1.setCode("2056001");
        action1.setLibelle("Organisation des enseignements et apprentissages");
        action1.setProgramme(programme1);
        action1.setDateEffet(LocalDate.of(2026, 1, 1));
        action1 = actionRepository.save(action1);

        Action action2 = new Action();
        action2.setCode("2056002");
        action2.setLibelle("Fonctionnement et équipement");
        action2.setProgramme(programme1);
        action2.setDateEffet(LocalDate.of(2026, 1, 1));
        action2 = actionRepository.save(action2);

        // Créer des activités
        Activite activite1 = new Activite();
        activite1.setCode("2056001001");
        activite1.setLibelle("Pédagogie et apprentissage");
        activite1.setAction(action1);
        activiteRepository.save(activite1);

        Activite activite2 = new Activite();
        activite2.setCode("2056002001");
        activite2.setLibelle("Maintenance des locaux");
        activite2.setAction(action2);
        activiteRepository.save(activite2);

        // Créer des catégories de dépense
        CategorieDepense cat3 = new CategorieDepense();
        cat3.setCode("3");
        cat3.setLibelle("Catégorie 3");
        cat3.setType("FONCTIONNEMENT");
        categorieDepenseRepository.save(cat3);

        CategorieDepense cat4 = new CategorieDepense();
        cat4.setCode("4");
        cat4.setLibelle("Catégorie 4");
        cat4.setType("INVESTISSEMENT");
        categorieDepenseRepository.save(cat4);

        // Créer des natures économiques
        NatureEconomique nat1 = new NatureEconomique();
        nat1.setCode("101");
        nat1.setLibelle("Salaires et traitements");
        nat1.setType("DEPENSES DE PERSONNEL");
        nat1.setValide(true);
        natureEconomiqueRepository.save(nat1);

        NatureEconomique nat2 = new NatureEconomique();
        nat2.setCode("602");
        nat2.setLibelle("Achats de fournitures");
        nat2.setType("ACHATS");
        nat2.setValide(true);
        natureEconomiqueRepository.save(nat2);

        // Créer des chapitres
        Chapitre chapitre1 = new Chapitre();
        chapitre1.setCode("1200");
        chapitre1.setLibelle("Personnels enseignants");
        chapitre1.setSection(section);
        chapitre1.setStatut("OUVERT");
        chapitre1.setDateEnregistrement(LocalDateTime.now());
        chapitreRepository.save(chapitre1);

        Chapitre chapitre2 = new Chapitre();
        chapitre2.setCode("6200");
        chapitre2.setLibelle("Fournitures scolaires");
        chapitre2.setSection(section);
        chapitre2.setStatut("OUVERT");
        chapitre2.setDateEnregistrement(LocalDateTime.now());
        chapitreRepository.save(chapitre2);

        // Créer des utilisateurs de test
        User operateur1 = new User();
        operateur1.setUsername("operateur1");
        operateur1.setEmail("operateur1@education.gov");
        operateur1.setPassword(passwordEncoder.encode("password"));
        operateur1.setNom("Dupont");
        operateur1.setPrenom("Marie");
        operateur1.setSection(section);
        operateur1.setRoles(Set.of(roleOperateur));
        operateur1.setActif(true);
        operateur1.setDateCreation(LocalDateTime.now());
        userRepository.save(operateur1);

        User operateur2 = new User();
        operateur2.setUsername("operateur2");
        operateur2.setEmail("operateur2@education.gov");
        operateur2.setPassword(passwordEncoder.encode("password"));
        operateur2.setNom("Martin");
        operateur2.setPrenom("Jean");
        operateur2.setSection(section);
        operateur2.setRoles(Set.of(roleOperateur));
        operateur2.setActif(true);
        operateur2.setDateCreation(LocalDateTime.now());
        userRepository.save(operateur2);

        User responsable1 = new User();
        responsable1.setUsername("responsable1");
        responsable1.setEmail("responsable1@education.gov");
        responsable1.setPassword(passwordEncoder.encode("password"));
        responsable1.setNom("Bernard");
        responsable1.setPrenom("Pierre");
        responsable1.setSection(section);
        responsable1.setRoles(Set.of(roleResponsable));
        responsable1.setActif(true);
        responsable1.setDateCreation(LocalDateTime.now());
        userRepository.save(responsable1);

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@education.gov");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setNom("Administrateur");
        admin.setPrenom("Système");
        admin.setSection(section);
        admin.setRoles(Set.of(roleAdmin));
        admin.setActif(true);
        admin.setDateCreation(LocalDateTime.now());
        userRepository.save(admin);

        System.out.println("✓ Données d'initialisation chargées avec succès");
        System.out.println("✓ Utilisateurs de test créés:");
        System.out.println("  - operateur1 / password");
        System.out.println("  - operateur2 / password");
        System.out.println("  - responsable1 / password");
        System.out.println("  - admin / admin123");
    }
}
