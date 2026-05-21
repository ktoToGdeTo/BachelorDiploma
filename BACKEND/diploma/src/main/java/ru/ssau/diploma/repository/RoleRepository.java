package ru.ssau.diploma.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssau.diploma.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
