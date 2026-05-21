package ru.ssau.diploma.service;

import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.ssau.diploma.entity.Role;
import ru.ssau.diploma.entity.User;
import ru.ssau.diploma.entity.dto.UserDto;
import ru.ssau.diploma.exception.UserAlreadyRegisterException;
import ru.ssau.diploma.repository.RoleRepository;
import ru.ssau.diploma.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private UserDto toUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());
        userDto.setRegisterDate(user.getRegisterDate());
        userDto.setBirthDate(user.getBirthDate());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        return userDto;
    }

    public void registerUser(UserDto userDto) throws UserAlreadyRegisterException{
        if(userRepository.existsByUsername(userDto.getUsername())) throw new UserAlreadyRegisterException();
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setRegisterDate(LocalDateTime.now());
        user.setBirthDate(userDto.getBirthDate());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());

        List<Role> roles = new ArrayList<>();
        if(userDto.getUsername().equalsIgnoreCase("admin")) roles.add(roleRepository.findByName("ROLE_ADMIN"));
        else roles.add(roleRepository.findByName("ROLE_USER"));
        user.setRoles(roles);

        user.setTasks(new ArrayList<>());

        userRepository.save(user);
    }

    public List<UserDto> getAllUsers(){
        List<User> users = userRepository.findAll();
        return users.stream().map(this::toUserDto).toList();
    }

    public void updatePassword(UserDto userDto) throws UsernameNotFoundException{
        Optional<User> foundedUser = userRepository.findByUsername(userDto.getUsername());
        if(foundedUser.isEmpty()) throw new UsernameNotFoundException(userDto.getUsername());
        User user = foundedUser.get();
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        userRepository.save(user);
    }


    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) throw new UsernameNotFoundException(username);
        return user.get();
    }
}
