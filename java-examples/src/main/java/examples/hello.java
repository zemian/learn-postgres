package examples;
import java.sql.*;
public class hello {
	public static void main(String[] args) {
		try (Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/testdb", "zemian", "test123")) {
            System.out.println("Connection successful!");
            System.out.println("Connection object=" + conn);
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect DB", e);
        }
	}
}
