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
@Table(name = "DR_users",schema = "dbo")
@SequenceGenerator(name = "usersSeq", sequenceName = "users_id_seq", allocationSize = 1)
public class User {

	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "usersSeq", strategy = GenerationType.SEQUENCE)
	private Long id;

	@Column(name = "username")
	private String userName;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(name = "pass")
	private String password;

	@Column(name = "firstname")
	private String firstName;

	@Column(name = "lastname")
	private String lastName;

	@Column(name = "personalno")
	private String personalNo;

	@Column(name = "active")
	private Boolean active;

	@JsonManagedReference
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH, mappedBy = "user")
	@Where(clause = "active = true")
	private List<UserPermission> userPermissions;

}
