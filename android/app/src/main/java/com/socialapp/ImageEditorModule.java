package com.socialapp;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.socialapp.activity.PhotoEditorActivity;

public class ImageEditorModule extends ReactContextBaseJavaModule {

    private static final int PHOTO_EDITOR_REQUEST = 1;
    private Promise promise;

    ImageEditorModule(ReactApplicationContext context) {
        super(context);

        // Thêm ActivityEventListener để lắng nghe kết quả từ PhotoEditor Activity
        context.addActivityEventListener(mActivityEventListener);
    }

    @NonNull
    @Override
    public String getName() {
        return "ImageEditorModule";
    }

    // Phương thức để mở PhotoEditor
    @ReactMethod
    public void openPhotoEditor(String imagePath, Promise promise) {
        this.promise = promise;

        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            Intent intent = new Intent(currentActivity, PhotoEditorActivity.class);
            intent.putExtra("imagePath", imagePath);
            currentActivity.startActivityForResult(intent, PHOTO_EDITOR_REQUEST);
        } else {
            promise.reject("NO_ACTIVITY", "Activity doesn't exist");
        }
    }

    // ActivityEventListener để xử lý kết quả từ PhotoEditorActivity
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == PHOTO_EDITOR_REQUEST) {
                if (promise == null) {
                    return;
                }

                if (resultCode == Activity.RESULT_OK) {
                    String editedImagePath = data.getStringExtra("editedImagePath");
                    promise.resolve(editedImagePath);
                } else {
                    promise.reject("PHOTO_EDITOR_CANCELLED", "Photo editor was cancelled");
                }

                promise = null;
            }
        }
    };
}