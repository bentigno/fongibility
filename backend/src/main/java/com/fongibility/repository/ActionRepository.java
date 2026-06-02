package com.fongibility.repository;

import com.fongibility.entity.Action;
import com.fongibility.entity.Programme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActionRepository extends JpaRepository<Action, Long> {
    Optional<Action> findByCode(String code);
    List<Action> findByProgramme(Programme programme);
}
