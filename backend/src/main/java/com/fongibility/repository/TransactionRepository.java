package com.fongibility.repository;

import com.fongibility.entity.Transaction;
import com.fongibility.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByNumeroTransaction(String numeroTransaction);
    List<Transaction> findBySection(Section section);
    List<Transaction> findByTransmiseTrue();
    List<Transaction> findByValideeTrue();
}
