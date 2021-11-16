package com.example.dr_info.model.transformator;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(schema = "dbo",name = "DISCONN_HISTORY")
public class DispatchTask {

	@Id
	private BigDecimal id;

	@Column(name = "DISCONN_ACTUAL_DATE")
	private Date disconnActualDate;

	@Column(name = "DISCONN_ACTUAL_TIME")
	private String disconnActualTime;

	@Column(name = "RECONN_ACTUAL_DATE")
	private Date reconnActualDate;

	@Column(name = "RECONN_ACTUAL_TIME")
	private String reconnActualTime;


}
