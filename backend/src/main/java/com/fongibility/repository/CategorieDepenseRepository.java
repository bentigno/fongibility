package com.fongibility.repository;

import com.fongibility.entity.CategorieDepense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategorieDepenseRepository extends JpaRepository<CategorieDepense, Long> {
    Optional<CategorieDepense> findByCode(String code);
}
