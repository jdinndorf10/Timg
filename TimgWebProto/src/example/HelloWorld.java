package example;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.Base64;
import java.util.Base64.Encoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class HelloWorld extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.getWriter().println("HelloWorld");
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		try {
		// String picURL = URLEncoder.encode("http://exmoorpet.com/wp-content/uploads/2012/08/cat.png","UTF-8");
		BufferedReader reqReader = req.getReader();
		String picURL = URLEncoder.encode(reqReader.readLine(), "UTF-8");

		String tagging = "/tagging?url=" + picURL;
		String webPage = "http://api.imagga.com/v1/" + tagging;
		String name = "acc_2cb40ac50fcc948";
		String password = "73ee809d8536ff398d213cba0375a515";
		
		System.out.println(picURL);

		// auth creation
		String authString = name + ":" + password;
		Encoder baseEncoder = Base64.getEncoder();
		String authEnc = baseEncoder.encodeToString(authString.getBytes());

		URL url = new URL(webPage);
		URLConnection urlConnection = url.openConnection();
		urlConnection.setRequestProperty("Authorization", "Basic " + authEnc);
		InputStream is = urlConnection.getInputStream();
		InputStreamReader isr = new InputStreamReader(is);

		int numCharsRead;
		char[] charArray = new char[1024];
		StringBuffer sb = new StringBuffer();
		while ((numCharsRead = isr.read(charArray)) > 0) {
			sb.append(charArray, 0, numCharsRead);
		}
		String result = sb.toString();

		//response
		resp.getWriter().println(result);
		}catch(Exception exp) {
			resp.sendError(0, "Bad URL");
			exp.printStackTrace();
		}
	}
}
