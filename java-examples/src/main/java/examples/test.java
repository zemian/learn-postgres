package examples;
import java.sql.*;
import java.util.*;
public class test {
	static List<Object> selectAll(Connection conn) throws SQLException {
		List<Object> list = new ArrayList<>();
		String sql = "SELECT * FROM test";
        try (PreparedStatement st = conn.prepareStatement(sql)) {
            st.executeQuery();
            try (ResultSet rs = st.getResultSet()) {
                while (rs.next()) {
                	List<Object> row = getRow(rs);
                    list.add(row);
                }
            }
        }
        return list;
	}
    static List<Object> selectById(Connection conn, Integer id) throws SQLException {
        List<Object> row = new ArrayList<>();
        String sql = "SELECT * FROM test WHERE id = ?";
        try (PreparedStatement st = conn.prepareStatement(sql)) {
            st.setInt(1, id);
            st.executeQuery();
            try (ResultSet rs = st.getResultSet()) {
                if (rs.next()) {
                    row = getRow(rs);
                }
            }
        }
        return row;
    }
    static List<Object> selectByCat(Connection conn, String cat) throws SQLException {
        List<Object> list = new ArrayList<>();
        String sql = "SELECT * FROM test WHERE cat = ?";
        try (PreparedStatement st = conn.prepareStatement(sql)) {
            st.setString(1, cat);
            st.executeQuery();
            try (ResultSet rs = st.getResultSet()) {
                while (rs.next()) {
                    List<Object> row = getRow(rs);
                    list.add(row);
                }
            }
        }
        return list;
    }
    static Double selectTotal(Connection conn, String cat) throws SQLException {
        Double ret = null;
        String sql = "SELECT sum(price) AS total FROM test WHERE cat = ?";
        try (PreparedStatement st = conn.prepareStatement(sql)) {
            st.setString(1, cat);
            st.executeQuery();
            try (ResultSet rs = st.getResultSet()) {
                if (rs.next()) {
                    ret = rs.getDouble("total");
                }
            }
        }
        return ret;
    }
    static Integer insert(Connection conn, String cat, Double price, Integer qty) throws SQLException {
	    Integer ret = 0;
        List<Object> row = new ArrayList<>();
        String sql = "INSERT INTO test(cat, price, qty) VALUES (?, ?, ?)";
        try (PreparedStatement st = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            st.setString(1, cat);
            st.setDouble(2, price);
            st.setInt(3, qty);
            st.executeUpdate();
            try (ResultSet rs = st.getGeneratedKeys()) {
                if (rs.next()) {
                    ret = rs.getInt(1);
                }
            }
        }
        return ret;
    }
    static Integer update(Connection conn, Integer id, Double price, Integer qty) throws SQLException {
        Integer ret = 0;
        String sql = "UPDATE test SET price = ?, qty = ? WHERE id = ?";
        try (PreparedStatement st = conn.prepareStatement(sql)) {
            st.setDouble(1, price);
            st.setInt(2, qty);
            st.setInt(3, id);
            ret = st.executeUpdate();
        }
        return ret;
    }
    static Integer delete(Connection conn, Integer id) throws SQLException {
        Integer ret = 0;
        String sql = "DELETE FROM test WHERE id = ?";
        try (PreparedStatement st = conn.prepareStatement(sql)) {
            st.setInt(1, id);
            ret = st.executeUpdate();
        }
        return ret;
    }
    static Integer deleteByCat(Connection conn, String cat) throws SQLException {
        Integer ret = 0;
        String sql = "DELETE FROM test WHERE cat = ?";
        try (PreparedStatement st = conn.prepareStatement(sql)) {
            st.setString(1, cat);
            ret = st.executeUpdate();
        }
        return ret;
    }

    static List<Object> getRow(ResultSet rs) throws SQLException {
        List<java.lang.Object> row = new ArrayList<>();
        row.add(rs.getObject("id"));
        row.add(rs.getObject("cat"));
        row.add(rs.getObject("price"));
        row.add(rs.getObject("qty"));
        return row;
    }

    public static void printList(List<?> list) {
	    if (list.size() == 0) {
            System.out.println("[]");
        } else {
            for (Object item : list) {
                System.out.println(item);
            }
        }
    }
    public static void printObject(Object obj) {
        System.out.println(obj);
    }
	public static void main(String[] args) {
		try (Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/testdb", "zemian", "test123")) {
		      printList(selectAll(conn));
//            printObject(selectById(conn, 1));
//            printList(selectByCat(conn, "test"));

//            printObject(insert(conn, "java", 0.10, 1));
//            printObject(insert(conn, "java", 0.10, 1));
//            printList(selectByCat(conn, "java"));

//            printObject(selectTotal(conn, "java"));
//            printObject(update(conn, 43, 0.99, 10));
//            printObject(selectTotal(conn, "java"));

//            printObject(selectById(conn, 43));
//            printObject(delete(conn, 43));
//            printObject(selectById(conn, 43));

//            printList(selectByCat(conn, "java"));
//            printObject(deleteByCat(conn, "java"));
//            printList(selectByCat(conn, "java"));

        } catch (Exception e) {
            throw new RuntimeException("Failed to connect DB", e);
        }
	}
}
