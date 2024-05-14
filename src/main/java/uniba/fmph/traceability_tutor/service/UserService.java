package uniba.fmph.traceability_tutor.service;

import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.exception.UserNotFoundException;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.mapper.UserMapper;
import uniba.fmph.traceability_tutor.model.UserDTO;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.UserRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(final UserRepository userRepository,
                       final ProjectRepository projectRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public List<UserDTO> findAll() {
        final List<User> users = userRepository.findAll(Sort.by("id"));
        return users.stream()
                .map(userMapper::toUserDTO)
                .toList();
    }

    public UserDTO get(final Long id) {
        return userRepository.findById(id)
                .map(userMapper::toUserDTO)
                .orElseThrow(NotFoundException::new);
    }




    public UserDTO findById(final Long id) {
        return userRepository.findById(id).map(userMapper::toUserDTO).orElseThrow(NotFoundException::new);
    }

    public Long create(final UserDTO userDTO) {
        final User user = new User();
        return userRepository.save(user).getId();
    }

    public void update(final Long id, final UserDTO userDTO) {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        userMapper.toUserDTO(user);
        userRepository.save(user);
    }

    public void delete(final Long id) {
        userRepository.deleteById(id);
    }


    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Project ownerProject = projectRepository.findFirstByOwner(user);
        if (ownerProject != null) {
            referencedWarning.setKey("user.project.owner.referenced");
            referencedWarning.addParam(ownerProject.getId());
            return referencedWarning;
        }
        return null;
    }


    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    public boolean hasUserWithEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User validateAndGetUserByEmail(String email) {
        return getUserByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(String.format("User with email %s not found", email)));
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

}
