package com.fongibility.repository;

import com.fongibility.entity.Chapitre;
import com.fongibility.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapitreRepository extends JpaRepository<Chapitre, Long> {
    Optional<Chapitre> findByCode(String code);
    List<Chapitre> findBySection(Section section);
}
