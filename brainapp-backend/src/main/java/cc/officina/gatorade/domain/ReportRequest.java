package cc.officina.gatorade.domain;

import com.fasterxml.jackson.databind.JsonNode;

public class ReportRequest {
	private JsonNode info;
	private JsonNode userAgent;
	public JsonNode getInfo() {
		return info;
	}
	public void setInfo(JsonNode info) {
		this.info = info;
	}
	public JsonNode getUserAgent() {
		return userAgent;
	}
	public void setUserAgent(JsonNode userAgent) {
		this.userAgent = userAgent;
	}
	@Override
	public String toString() {
		return "ReportRequest [info=" + info + ", userAgent=" + userAgent + "]";
	}
	
	
}
