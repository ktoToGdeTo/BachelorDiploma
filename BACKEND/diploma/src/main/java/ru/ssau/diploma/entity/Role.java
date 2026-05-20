package ru.ssau.diploma.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "role")
public class Role implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private long id;

    private String name;
    @ManyToMany(mappedBy = "roles")
    private List<User> users;

    @Override
    public @Nullable String getAuthority() {
        return getName();
    }
}
