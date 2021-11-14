package com.example.dr_info.global.user.service;

import com.example.dr_info.model.user.User;
import com.example.dr_info.repository.drInfo.UserRepository;
import javassist.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

	private final UserRepository userRepository;
	//private final UserPermissionRepository userPermissionRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUserName(username);
		if (user == null) throw new UsernameNotFoundException(username);

		List<String> userAuthorities = new ArrayList<>();

		UserDetailsImpl userDetails = new UserDetailsImpl(user, userAuthorities.stream()
				.map(SimpleGrantedAuthority::new).collect(Collectors.toList()));

		return userDetails;
	}

	public User getById(long userId) throws NotFoundException {
		Optional<User> user = userRepository.findById(userId);
		if (user.isEmpty()) {
			throw new NotFoundException(String.format("User with id: %d not found", userId));
		}
		return user.get();
	}
}
