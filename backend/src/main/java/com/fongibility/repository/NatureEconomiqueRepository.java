package com.fongibility.repository;

import com.fongibility.entity.NatureEconomique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NatureEconomiqueRepository extends JpaRepository<NatureEconomique, Long> {
    Optional<NatureEconomique> findByCode(String code);
}
