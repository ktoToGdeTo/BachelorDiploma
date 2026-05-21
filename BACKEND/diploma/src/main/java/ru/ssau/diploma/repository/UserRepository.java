package ru.ssau.diploma.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssau.diploma.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findById(Long id);

    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);
}
