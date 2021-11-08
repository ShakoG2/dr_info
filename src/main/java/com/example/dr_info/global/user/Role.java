package com.example.dr_info.global.user;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "roles")
@SequenceGenerator(name = "rolesSeq", sequenceName = "roles_id_seq", allocationSize = 1)
public class Role {

	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "rolesSeq", strategy = GenerationType.SEQUENCE)
	private Long id;

	@Column(name = "name")
	private String name;

	@Column(name = "title")
	private String title;
}
