package com.fongibility.service;

import com.fongibility.dto.UserDTO;
import com.fongibility.entity.Role;
import com.fongibility.entity.Section;
import com.fongibility.entity.User;
import com.fongibility.repository.RoleRepository;
import com.fongibility.repository.SectionRepository;
import com.fongibility.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public UserDTO getUserDTOByUsername(String username) {
        User user = getUserByUsername(username);
        return user != null ? convertToDTO(user) : null;
    }

    public User createUser(String username, String email, String password, Long sectionId, String... roleNames) {
        Section section = sectionRepository.findById(sectionId).orElse(null);
        if (section == null) return null;

        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            Role role = roleRepository.findByNom(roleName)
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setNom(roleName);
                        return roleRepository.save(newRole);
                    });
            roles.add(role);
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setSection(section);
        user.setRoles(roles);
        user.setActif(true);
        user.setDateCreation(LocalDateTime.now());

        return userRepository.save(user);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .sectionId(user.getSection().getId())
                .sectionLibelle(user.getSection().getLibelle())
                .roles(user.getRoles().stream().map(Role::getNom).collect(Collectors.toSet()))
                .actif(user.getActif())
                .dateCreation(user.getDateCreation())
                .build();
    }
}
