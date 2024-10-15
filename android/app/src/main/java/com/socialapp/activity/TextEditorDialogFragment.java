package com.socialapp.activity;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.ColorInt;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.DialogFragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.socialapp.R;

public class TextEditorDialogFragment extends DialogFragment {
    private EditText mAddTextEditText;
    private TextView mAddTextDoneTextView;
    private InputMethodManager mInputMethodManager;
    private int mColorCode = 0;
    private TextEditorListener mTextEditorListener;

    public interface TextEditorListener {
        void onDone(String inputText, int colorCode);
    }

    @Override
    public void onStart() {
        super.onStart();
        Dialog dialog = getDialog();
        if (dialog != null) {
            int width = ViewGroup.LayoutParams.MATCH_PARENT;
            int height = ViewGroup.LayoutParams.MATCH_PARENT;
            dialog.getWindow().setLayout(width, height);
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.add_text_dialog, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        mAddTextEditText = view.findViewById(R.id.add_text_edit_text);
        mInputMethodManager = (InputMethodManager) requireActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        mAddTextDoneTextView = view.findViewById(R.id.add_text_done_tv);

        // Setup the color picker for text color
        RecyclerView addTextColorPickerRecyclerView = view.findViewById(R.id.add_text_color_picker_recycler_view);
        LinearLayoutManager layoutManager = new LinearLayoutManager(requireActivity(), LinearLayoutManager.HORIZONTAL, false);
        addTextColorPickerRecyclerView.setLayoutManager(layoutManager);
        addTextColorPickerRecyclerView.setHasFixedSize(true);

        ColorPickerAdapter colorPickerAdapter = new ColorPickerAdapter(requireActivity());
        // This listener will change the text color when clicked on any color from picker
        colorPickerAdapter.setOnColorPickerClickListener(new ColorPickerAdapter.OnColorPickerClickListener() {
            @Override
            public void onColorPickerClickListener(int colorCode) {
                mColorCode = colorCode;
                mAddTextEditText.setTextColor(colorCode);
            }
        });

        addTextColorPickerRecyclerView.setAdapter(colorPickerAdapter);

        Bundle arguments = requireArguments();
        mAddTextEditText.setText(arguments.getString(EXTRA_INPUT_TEXT));
        mColorCode = arguments.getInt(EXTRA_COLOR_CODE);
        mAddTextEditText.setTextColor(mColorCode);
        mInputMethodManager.toggleSoftInput(InputMethodManager.SHOW_FORCED, 0);

        // Make a callback on activity when user is done with text editing
        mAddTextDoneTextView.setOnClickListener(view1 -> {
            mInputMethodManager.hideSoftInputFromWindow(view1.getWindowToken(), 0);
            dismiss();
            String inputText = mAddTextEditText.getText().toString();
            if (!inputText.isEmpty() && mTextEditorListener != null) {
                mTextEditorListener.onDone(inputText, mColorCode);
            }
        });
    }

    // Callback to listener if user is done with text editing
    public void setOnTextEditorListener(TextEditorListener textEditorListener) {
        mTextEditorListener = textEditorListener;
    }

    public static final String EXTRA_INPUT_TEXT = "extra_input_text";
    public static final String EXTRA_COLOR_CODE = "extra_color_code";

    // Show dialog with provide text and text color
    // Show dialog with default text input as empty and text color white
    public static TextEditorDialogFragment show(
            AppCompatActivity appCompatActivity,
            String inputText,
            @ColorInt int colorCode) {
        if (colorCode == 0) {
            colorCode = ContextCompat.getColor(appCompatActivity, R.color.white);
        }

        TextEditorDialogFragment fragment = new TextEditorDialogFragment();
        Bundle args = new Bundle();
        args.putString(EXTRA_INPUT_TEXT, inputText);
        args.putInt(EXTRA_COLOR_CODE, colorCode);
        fragment.setArguments(args);
        fragment.show(appCompatActivity.getSupportFragmentManager(), TextEditorDialogFragment.class.getSimpleName());
        return fragment;
    }
}
