package com.example.dr_info.model.transformator;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@Table(schema = "dbo",name = "DISPATCH_TASK")
public class DispatchTask {

	@Id
	private BigDecimal id;

	@Column(name = "DISCONN_ACTUAL_DATE")
	private Timestamp disconnActualDate;

	@Column(name = "DISCONN_ACTUAL_TIME")
	private String disconnActualTime;

	@Column(name = "RECONN_ACTUAL_DATE")
	private Timestamp reconnActualDate;

	@Column(name = "RECONN_ACTUAL_TIME")
	private String reconnActualTime;


}
