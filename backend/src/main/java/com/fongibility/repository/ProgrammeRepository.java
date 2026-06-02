package com.fongibility.repository;

import com.fongibility.entity.Programme;
import com.fongibility.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgrammeRepository extends JpaRepository<Programme, Long> {
    Optional<Programme> findByCode(String code);
    List<Programme> findBySection(Section section);
}
