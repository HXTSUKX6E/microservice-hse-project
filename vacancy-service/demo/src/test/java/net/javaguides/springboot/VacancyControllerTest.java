package net.javaguides.springboot;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.dto.VacancyDto;
import net.javaguides.springboot.model.Company;
import net.javaguides.springboot.model.Vacancy;
import net.javaguides.springboot.service.VacancyService;
import net.javaguides.springboot.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CompletableFuture;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Slf4j
public class VacancyControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private VacancyService vacancyService;

    private String token;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity()) // Включаем поддержку Spring Security
                .build();
    }

    @Test
    @WithMockUser
    public void testPost_SuccessfullyVacancy() throws Exception {

        VacancyDto vacancyDto = new VacancyDto();
        vacancyDto.setTitle("Title");
        vacancyDto.setContact("Contact");
        vacancyDto.setCompany_id(1L);

        Vacancy vacancy = new Vacancy();
        vacancy.setTitle(vacancyDto.getTitle());

        token = jwtUtil.generateToken("user1", 1L);
        when(vacancyService.createVacancy(any(VacancyDto.class))).thenReturn(CompletableFuture.completedFuture(vacancy));
        // Выполнение запроса и проверка результата
        MvcResult result = mockMvc.perform(post("/api/vacancy")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(vacancyDto)))
                .andExpect(status().isOk())
                .andReturn(); // Получаем результат выполнения запроса

        String responseBody = result.getResponse().getContentAsString();
        System.out.println(responseBody);

        verify(vacancyService, times(1)).createVacancy(any(VacancyDto.class));
    }

    @Test
    @WithMockUser
    public void testPost_VacancyBadRequest() throws Exception {

        VacancyDto vacancyDto = new VacancyDto();
        // оставляем пустые обязательные поля (404)
        Vacancy vacancy = new Vacancy();

        token = jwtUtil.generateToken("user1", 1L);
        when(vacancyService.createVacancy(any(VacancyDto.class))).thenReturn(CompletableFuture.completedFuture(vacancy));
        // Выполнение запроса и проверка результата
        MvcResult result = mockMvc.perform(post("/api/vacancy")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(vacancyDto)))
                .andExpect(status().isBadRequest())
                .andReturn(); // Получаем результат выполнения запроса

        String responseBody = result.getResponse().getContentAsString();
        System.out.println(responseBody);

        verify(vacancyService, times(0)).createVacancy(any(VacancyDto.class));
    }

    @Test
    @WithMockUser
    public void testPost_VacancyWithOtherRole() throws Exception {

        VacancyDto vacancyDto = new VacancyDto();
        vacancyDto.setTitle("Title");
        vacancyDto.setContact("Contact");
        vacancyDto.setCompany_id(1L);
        Vacancy vacancy = new Vacancy();

        token = jwtUtil.generateToken("user1", 2L); // обычный юзер
        when(vacancyService.createVacancy(any(VacancyDto.class))).thenReturn(CompletableFuture.completedFuture(vacancy));
        // Выполнение запроса и проверка результата
        MvcResult result = mockMvc.perform(post("/api/vacancy")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(vacancyDto)))
                .andExpect(status().isForbidden())
                .andReturn(); // Получаем результат выполнения запроса

        String responseBody = result.getResponse().getContentAsString();
        System.out.println(responseBody);

        verify(vacancyService, times(0)).createVacancy(any(VacancyDto.class));
    }
}