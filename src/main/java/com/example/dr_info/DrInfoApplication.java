package com.example.dr_info;

import com.example.dr_info.global.Object.ObjectCategoryService;
import com.example.dr_info.model.transformator.ObjectCategory;
import com.example.dr_info.repository.dispatch.ObjectCategoryRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@SpringBootApplication
@EnableConfigurationProperties
public class DrInfoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DrInfoApplication.class, args);
	}


	@Bean
	public PasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
