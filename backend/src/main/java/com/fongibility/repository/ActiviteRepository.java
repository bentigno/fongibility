package com.fongibility.repository;

import com.fongibility.entity.Activite;
import com.fongibility.entity.Action;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActiviteRepository extends JpaRepository<Activite, Long> {
    Optional<Activite> findByCode(String code);
    List<Activite> findByAction(Action action);
}
