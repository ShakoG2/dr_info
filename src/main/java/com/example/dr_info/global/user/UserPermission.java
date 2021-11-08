package com.example.dr_info.global.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "user_permissions")
@SequenceGenerator(name = "userPermissionsSeq", sequenceName = "user_permissions_id_seq", allocationSize = 1)
public class UserPermission {

	public UserPermission() {

	}

	public UserPermission(Long userId, Long authorityId, Long roleId) {
		this.permissionUserId = userId;
		this.authorityId = authorityId;
		this.roleId = roleId;
	}

	@Id
	@Column(name = "id")
	@GeneratedValue(generator = "userPermissionsSeq", strategy = GenerationType.SEQUENCE)
	private Long id;

	@Column(name = "permission_user_id")
	private Long permissionUserId;

	@Column(name = "authority_id")
	private Long authorityId;

	@Column(name = "role_id")
	private Long roleId;

	@JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
	@JoinColumn(name = "permission_user_id", referencedColumnName = "id", insertable = false, updatable = false)
	private User user;


	@ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REFRESH)
	@JoinColumn(name = "authority_id", referencedColumnName = "id", insertable = false, updatable = false)
	private Authority authority;

	@ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REFRESH)
	@JoinColumn(name = "role_id", referencedColumnName = "id", insertable = false, updatable = false)
	private Role role;
}
