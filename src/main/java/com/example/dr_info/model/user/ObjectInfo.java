package com.example.dr_info.model.user;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "object_infos",schema = "dbo")
@SequenceGenerator(name = "objectInfoSeq", sequenceName = "object_info_id_seq", allocationSize = 1)
public class ObjectInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE,generator ="objectInfoSeq")
	private Long id;

	@Column(name = "task_id")
	private Long taskId;

	@Column(name = "cust_number")
	private String custNumber;

	@Column(name = "disconnected_date")
	private Date disconnectedDate;

	@Column(name = "disconnected_time")
	private String disconnectedTime;

	@Column(name = "reconnected_date")
	private Date reconnectedDate;

	@Column(name = "reconnected_time")
	private String reconnectedTime;

	@Column(name = "turn_off_duration")
	private String turnOffDuration;
}
