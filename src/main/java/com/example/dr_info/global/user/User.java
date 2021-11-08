package com.example.dr_info.global.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
@SequenceGenerator(name = "usersSeq", sequenceName = "users_id_seq", allocationSize = 1)
public class User {

	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "usersSeq", strategy = GenerationType.SEQUENCE)
	private Long id;

	@Column(name = "user_name")
	private String userName;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(name = "password")
	private String password;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "personal_no")
	private String personalNo;

	@Column(name = "active")
	private Boolean active;

	@JsonManagedReference
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH, mappedBy = "user")
	@Where(clause = "active = true")
	private List<UserPermission> userPermissions;

}
