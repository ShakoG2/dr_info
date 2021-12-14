package com.example.dr_info.model.drInfo;

import com.fasterxml.jackson.annotation.JsonProperty;


import javax.persistence.*;

@Entity
@Table(name = "DR_users",schema = "dbo")
@SequenceGenerator(name = "usersSeq", sequenceName = "users_id_seq", allocationSize = 1)
public class User {

	public User() {

	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setPersonalNo(String personalNo) {
		this.personalNo = personalNo;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Long getId() {
		return id;
	}

	public String getUserName() {
		return userName;
	}

	public String getPassword() {
		return password;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getPersonalNo() {
		return personalNo;
	}

	public Boolean getActive() {
		return active;
	}

	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "usersSeq", strategy = GenerationType.SEQUENCE)
	private Long id;

	public User(Long id, String userName, String password, String firstName, String lastName, String personalNo, Boolean active) {
		this.id = id;
		this.userName = userName;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.personalNo = personalNo;
		this.active = active;
	}

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

//	@JsonManagedReference
//	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH, mappedBy = "user")
//	@Where(clause = "active = true")
//	private List<UserPermission> userPermissions;

}
