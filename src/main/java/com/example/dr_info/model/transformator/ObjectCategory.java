package com.example.dr_info.model.transformator;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Table(schema = "dbo",name = "DISCONN_HISTORY")
public class ObjectCategory {

	@Id
	private Long id;

	@Column(name = "TASK_ID")
	private BigDecimal taskId;

	@Column(name = "COMP_CUST_ID")
	private BigDecimal compCustId;


	@Column(name = "CUST_NUMBER")
	private String custNumber;
}
