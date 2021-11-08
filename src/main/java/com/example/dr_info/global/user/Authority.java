package com.example.dr_info.global.user;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;


@Getter
@Setter
@Entity
@Table(name = "authorities")
@SequenceGenerator(name = "authoritiesSeq", sequenceName = "authorities_id_seq", allocationSize = 1)
public class Authority {
	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "authoritiesSeq", strategy = GenerationType.SEQUENCE)
	private Long id;

	@Column(name = "name")
	private String name;

	@Column(name = "title")
	private String title;
}
