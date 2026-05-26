package ru.ssau.diploma.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssau.diploma.entity.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
