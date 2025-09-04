package com.flowstruct.api.user.repository;

import com.flowstruct.api.user.domain.User;
import org.springframework.data.repository.ListCrudRepository;

import java.util.Optional;

public interface UserRepository extends ListCrudRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
