package com.socialapp.activity;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;

import com.socialapp.R;

public class ProcessDialog {
    Activity mActivity;
    AlertDialog mDialog;

    ProcessDialog(Activity activity){
        mActivity = activity;
    }

    public void showProcessDialog() {
        AlertDialog.Builder builder= new AlertDialog.Builder(mActivity);

        LayoutInflater inflater = mActivity.getLayoutInflater();
        builder.setView(inflater.inflate(R.layout.process_dialog, null));
        builder.setCancelable(false);

        mDialog = builder.create();
        if(mDialog.getWindow() != null){
            mDialog.getWindow().setBackgroundDrawable(new ColorDrawable(0));
        }
        mDialog.show();
    }

    public void hideProcessDialog(){
        mDialog.dismiss();
    }
}
