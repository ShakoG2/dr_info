package com.example.dr_info.configuration;

import com.example.dr_info.global.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletResponse;

@Configuration
//@EnableWebMvc
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth
				.userDetailsService(userService)
				.passwordEncoder(passwordEncoder);
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors();
		http.csrf().disable();
		http.headers().cacheControl().disable();
		http.headers().frameOptions().sameOrigin();

		http.authorizeRequests()
				.antMatchers(HttpMethod.GET,
							 "/css/**",
							 "/js/**",
							 "/index.html",
							 "/fonts/**",
							 "/webfonts/**",
							 "/",
							 "/rates-screen/rates",
							 "/app.js",
							 "/login",
							 "/users",
							 "/app/**").permitAll()
				.anyRequest().authenticated();

		http.exceptionHandling()
				.authenticationEntryPoint((request, response, authException) ->
												  response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage()));
		http.formLogin()
				.failureHandler((httpServletRequest, httpServletResponse, e) ->
										httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage()));

		http.logout()
				.logoutUrl("/logout")
				.logoutSuccessUrl("/");

//		http.sessionManagement()
//				.maximumSessions(100)
//				.maxSessionsPreventsLogin(false)
//				.expiredUrl("/")
//				.sessionRegistry(sessionRegistry());
	}

//	@Override
//	public void configure(WebSecurity web) {
//		web.ignoring()
//				.antMatchers("/static/**", "/resources/**", "/js/**", "/css/**", "/images/**");
//
//	}

	@Bean
	SessionRegistry sessionRegistry() {
		return new SessionRegistryImpl();
	}

	@Bean
	public static ServletListenerRegistrationBean httpSessionEventPublisher() {
		return new ServletListenerRegistrationBean(new HttpSessionEventPublisher());
	}
}
