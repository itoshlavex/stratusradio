package io.ololiohill.stratusradio;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // The "now playing" notification (see NowPlayingPlugin). Registered before
        // super.onCreate, which builds the bridge and loads the site.
        registerPlugin(NowPlayingPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
