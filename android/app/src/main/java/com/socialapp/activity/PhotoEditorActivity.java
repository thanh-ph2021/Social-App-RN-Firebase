package com.socialapp.activity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.view.ContextThemeWrapper;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.socialapp.R;
import com.socialapp.activity.base.BaseActivity;
import com.socialapp.activity.tools.EditingToolsAdapter;
import com.socialapp.activity.tools.ToolModel;
import com.socialapp.activity.tools.ToolType;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import ja.burhanrashid52.photoeditor.OnPhotoEditorListener;
import ja.burhanrashid52.photoeditor.PhotoEditor;
import ja.burhanrashid52.photoeditor.PhotoEditorView;
import ja.burhanrashid52.photoeditor.TextStyleBuilder;
import ja.burhanrashid52.photoeditor.ViewType;
import ja.burhanrashid52.photoeditor.shape.ShapeBuilder;
import ja.burhanrashid52.photoeditor.shape.ShapeType;

public class PhotoEditorActivity extends BaseActivity implements View.OnClickListener,
        EditingToolsAdapter.OnItemSelected, OnPhotoEditorListener,
        PropertiesBSFragment.Properties, ShapeBSFragment.Properties, EmojiBSFragment.EmojiListener,
        StickerBSFragment.StickerListener {

    private PhotoEditor mPhotoEditor;
    private PhotoEditorView mPhotoEditorView;
    private PropertiesBSFragment mPropertiesBSFragment;
    private ShapeBSFragment mShapeBSFragment;
    private ShapeBuilder mShapeBuilder;
    private EmojiBSFragment mEmojiBSFragment;
    private StickerBSFragment mStickerBSFragment;
    private String imagePath;
    private ImageView mImgRedo, mImgUndo;
    private RecyclerView mRvTools;
    private EditingToolsAdapter mEditingToolsAdapter;
    private ProcessDialog processDialog;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        makeFullScreen();
        setContentView(R.layout.activity_photo_editor);

        initViews();

        LinearLayoutManager llmTools = new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false);
        mRvTools.setLayoutManager(llmTools);
        mRvTools.setAdapter(mEditingToolsAdapter);

        mPropertiesBSFragment = new PropertiesBSFragment();
        mEmojiBSFragment = new EmojiBSFragment(getApplicationContext());
        mStickerBSFragment = new StickerBSFragment();
        mShapeBSFragment = new ShapeBSFragment();
        mStickerBSFragment.setStickerListener(this);
        mEmojiBSFragment.setEmojiListener(this);
        mPropertiesBSFragment.setPropertiesChangeListener(this);
        mShapeBSFragment.setPropertiesChangeListener(this);

        // Lấy đường dẫn ảnh từ Intent
        getImagePath();

        // Thiết lập ảnh cho PhotoEditorView
        int matchParent = ViewGroup.LayoutParams.MATCH_PARENT;
        mPhotoEditorView.getSource().setLayoutParams(new RelativeLayout.LayoutParams(matchParent, matchParent));
        mPhotoEditorView.getSource().setImageURI(Uri.parse(new File(imagePath).toString()));
        mPhotoEditorView.getSource().setScaleType(ImageView.ScaleType.FIT_XY);
        

        // Khởi tạo PhotoEditor
        mPhotoEditor = new PhotoEditor.Builder(this, mPhotoEditorView)
                .setPinchTextScalable(true)
                .setDefaultEmojiTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD))
                .build();
    }

    private void getImagePath() {
        imagePath = getIntent().getStringExtra("imagePath");
        if (imagePath == null) {
            setResult(RESULT_CANCELED);
            finish();
        } else {
            Log.d("PhotoEditorActivity", "Received imagePath: " + imagePath);
        }
    }

    private void initViews() {
        processDialog = new ProcessDialog(this);
        mPhotoEditorView = findViewById(R.id.photoEditorView);
        mRvTools = findViewById(R.id.rvConstraintTools);

        mImgUndo = findViewById(R.id.imgUndo);
        mImgUndo.setOnClickListener(this);

        mImgRedo = findViewById(R.id.imgRedo);
        mImgRedo.setOnClickListener(this);

        Button btnShare = findViewById(R.id.btnShare);
        btnShare.setOnClickListener(this);

        ImageView imgClose = findViewById(R.id.imgClose);
        imgClose.setOnClickListener(this);

        List<ToolModel> listTool = new ArrayList<>();
        listTool.add(new ToolModel("Shape", R.drawable.ic_brush, ToolType.SHAPE));
        listTool.add(new ToolModel("Text", R.drawable.ic_text, ToolType.TEXT));
        listTool.add(new ToolModel("Eraser", R.drawable.ic_eraser, ToolType.ERASER));
        listTool.add(new ToolModel("Emoji", R.drawable.ic_insert_emoticon, ToolType.EMOJI));
        listTool.add(new ToolModel("Sticker", R.drawable.ic_sticker, ToolType.STICKER));

        mEditingToolsAdapter = new EditingToolsAdapter(this, listTool);
    }

    private void saveImage() {
        File editedFile = new File(getCacheDir(), "edited_image_" + System.currentTimeMillis() + ".png");
        processDialog.showProcessDialog();
        try (FileOutputStream fos = new FileOutputStream(editedFile)) {
            mPhotoEditor.saveAsFile(editedFile.getAbsolutePath(), new PhotoEditor.OnSaveListener() {
                @Override
                public void onSuccess(@NonNull String imagePath) {
                    // Trả về đường dẫn ảnh đã chỉnh sửa
                    Intent resultIntent = new Intent();
                    resultIntent.putExtra("editedImagePath", imagePath);
                    setResult(RESULT_OK, resultIntent);
                    processDialog.hideProcessDialog();
                    finish();
                }

                @Override
                public void onFailure(@NonNull Exception exception) {
                    // Ghi log lỗi và gửi kết quả lỗi nếu quá trình lưu thất bại
                    exception.printStackTrace();
                    setResult(RESULT_CANCELED);
                    processDialog.hideProcessDialog();
                    finish();
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
            setResult(RESULT_CANCELED);
            processDialog.hideProcessDialog();
            finish();
        }
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.imgClose:
                onBackPressed();
                break;
            case R.id.btnShare:
                saveImage();
                break;

            case R.id.imgUndo:
                mPhotoEditor.undo();
                break;

            case R.id.imgRedo:
                mPhotoEditor.redo();
                break;
        }
    }

    @Override
    public void onToolSelected(ToolType toolType) {
        switch (toolType) {
            case TEXT:
                TextEditorDialogFragment textEditorDialogFragment =
                        TextEditorDialogFragment.show(this, "", 0);
                textEditorDialogFragment.setOnTextEditorListener((inputText, colorCode) -> {
                    TextStyleBuilder styleBuilder = new TextStyleBuilder();
                    styleBuilder.withTextColor(colorCode);
                    mPhotoEditor.addText(inputText, styleBuilder);
                });
                break;
            case SHAPE:
                mPhotoEditor.setBrushDrawingMode(true);
                mShapeBuilder = new ShapeBuilder();
                mPhotoEditor.setShape(mShapeBuilder);
                showBottomSheetDialogFragment(mShapeBSFragment);
                break;
            case ERASER:
                mPhotoEditor.brushEraser();
                break;
            case EMOJI:
                showBottomSheetDialogFragment(mEmojiBSFragment);
                break;
            case STICKER:
                showBottomSheetDialogFragment(mStickerBSFragment);
                break;
        }
    }

    private void showBottomSheetDialogFragment(BottomSheetDialogFragment fragment) {
        if (fragment == null || fragment.isAdded()) {
            return;
        }
        fragment.show(getSupportFragmentManager(), fragment.getTag());
    }

    @Override
    public void onEditTextChangeListener(@NonNull View view, @NonNull String s, int i) {
        TextEditorDialogFragment textEditorDialogFragment = TextEditorDialogFragment
                .show(this, s, i);
        textEditorDialogFragment.setOnTextEditorListener((inputText, colorCode) -> {
            TextStyleBuilder styleBuilder = new TextStyleBuilder();
            styleBuilder.withTextColor(colorCode);
            mPhotoEditor.editText(view, inputText, styleBuilder);
        });
    }

    @Override
    public void onAddViewListener(@NonNull ViewType viewType, int i) {

    }

    @Override
    public void onRemoveViewListener(@NonNull ViewType viewType, int i) {

    }

    @Override
    public void onStartViewChangeListener(@NonNull ViewType viewType) {

    }

    @Override
    public void onStopViewChangeListener(@NonNull ViewType viewType) {

    }

    @Override
    public void onTouchSourceImage(@NonNull MotionEvent motionEvent) {

    }

    @Override
    public void onColorChanged(int colorCode) {
        mPhotoEditor.setShape(mShapeBuilder.withShapeColor(colorCode));
    }

    @Override
    public void onOpacityChanged(int opacity) {
        mPhotoEditor.setShape(mShapeBuilder.withShapeOpacity(opacity));
    }

    @Override
    public void onShapeSizeChanged(int shapeSize) {
        mPhotoEditor.setShape(mShapeBuilder.withShapeSize((float) shapeSize));
    }

    @Override
    public void onShapePicked(ShapeType shapeType) {
        mPhotoEditor.setShape(mShapeBuilder.withShapeType(shapeType));
    }

    @Override
    public void onStickerClick(Bitmap bitmap) {
        mPhotoEditor.addImage(bitmap);
    }

    @Override
    public void onEmojiClick(String emojiUnicode) {
        mPhotoEditor.addEmoji(emojiUnicode);
    }

}
