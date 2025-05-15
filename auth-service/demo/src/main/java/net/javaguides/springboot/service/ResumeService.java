package net.javaguides.springboot.service;

import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.dto.CreateResumeRequest;
import net.javaguides.springboot.dto.ReturnStatusDeleteDto;
import net.javaguides.springboot.exception.ResourceNotFoundException;
import net.javaguides.springboot.model.Resume;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.repository.ResumeRepository;
import net.javaguides.springboot.repository.RoleRepository;
import net.javaguides.springboot.repository.UserRepository;
import net.javaguides.springboot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Console;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class ResumeService {

    private final UserRepository userRepository;

    private final ResumeRepository resumeRepository;
    private final JwtUtil jwtUtil;

    // Конструктор для инъекции зависимостей
    @Autowired
    public ResumeService(UserRepository userRepository,
                         ResumeRepository resumeRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.jwtUtil = jwtUtil;
    }

    @Async
    @Transactional
    public CompletableFuture<Resume> createResume(CreateResumeRequest request, String token) {
        String username = jwtUtil.extractUsername(token);

        // Загрузка пользователя происходит в текущей транзакции
        User user = userRepository.findByLogin(username)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден!"));

        // Проверка через связь
        if (user.getResume() != null) {
            throw new IllegalStateException("Резюме уже существует для этого пользователя");
        }

        Resume resume = new Resume();

        setResume(request, resume);
        // Устанавливаем двунаправленную связь
        resume.setUser(user);
        user.setResume(resume);

        // Каскадирование сохранит оба объекта
        return CompletableFuture.completedFuture(resumeRepository.save(resume));
    }

    @Async
    public CompletableFuture<Resume> getResume(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("У пользователя нет резюме!"));

        return CompletableFuture.completedFuture(resume);
    }

    @Async
    public CompletableFuture<Resume> putResume(CreateResumeRequest request, String token, Long id) {
        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByLogin(username)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден!"));
        if (!Objects.equals(user.getUser_id(), id)) {
            throw new IllegalStateException("Нет доступа!");
        }

        Resume resume = user.getResume();
        setResume(request, resume);
//        resume.setUser(user);
//        user.setResume(resume);

        return CompletableFuture.completedFuture(resumeRepository.save(resume));
    }

    private void setResume(CreateResumeRequest request, Resume resume) {
        resume.setEducation(request.getEducation());
        resume.setPlaceEducation(request.getPlaceEducation());
        resume.setGender(request.getGender());
        resume.setFullName(request.getFullName());
        resume.setDescription(request.getDescription());
        resume.setSkills(request.getSkills());
        resume.setBirthday(request.getBirthday());
        resume.setContact(request.getContact());
        resume.setPhone(request.getPhone());
    }


    @Async
    public CompletableFuture<ReturnStatusDeleteDto> deleteResume(Long id, String token) {

        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByLogin(username)
                .orElseThrow(() -> new ResourceNotFoundException("Error!"));
        if (!Objects.equals(user.getUser_id(), id)) {
            throw new IllegalStateException("Нет доступа!");
        }
        resumeRepository.delete(user.getResume());
        ReturnStatusDeleteDto returnStatusDeleteDto = new ReturnStatusDeleteDto();
        returnStatusDeleteDto.setStatus("Резюме успешно удалено");

        return CompletableFuture.completedFuture(returnStatusDeleteDto);
    }
}
