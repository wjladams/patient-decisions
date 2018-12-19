package com.wjladams.patientdecisions;

import android.app.Activity;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebView;

public class HTMLActivity extends Activity {
    private static final String HTML_RESOURCE = "file:///android_asset/html/ex1_with_css.html";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_html);
        WebView webView = findViewById(R.id.webView);
        webView.loadUrl(HTML_RESOURCE);
    }
}
