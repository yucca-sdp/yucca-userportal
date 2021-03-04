/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */
package org.csi.yucca.userportal.intro.dto;


public class User {

	
	private String lastName;
	private String firstName;
	private String username;
	
	public User(org.csi.yucca.userportal.intro.dto.datacat.User userInfo) {
		this.lastName = userInfo.getLastname();
		this.firstName = userInfo.getFirstname();
		this.username = userInfo.getUserIdentifier();
	}

	public User(org.csi.yucca.userportal.intro.dto.yucca.User datacatUser) {
		this.lastName  = datacatUser.getLastname();
		this.firstName = datacatUser.getFirstname();
		this.username = datacatUser.getUsername();
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	

}
