package com.socialapp.activity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SeekBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.socialapp.R;
import com.socialapp.activity.tools.EditingToolsAdapter;
import com.socialapp.activity.tools.ToolModel;
import com.socialapp.activity.tools.ToolType;

import java.util.ArrayList;
import java.util.List;

import ja.burhanrashid52.photoeditor.shape.ShapeType;

public class ShapeBSFragment extends BottomSheetDialogFragment implements SeekBar.OnSeekBarChangeListener,
        EditingToolsAdapter.OnItemSelected {

    private Properties mProperties;

    public interface Properties {
        void onColorChanged(int colorCode);

        void onOpacityChanged(int opacity);

        void onShapeSizeChanged(int shapeSize);

        void onShapePicked(ShapeType shapeType);
    }

    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        return inflater.inflate(
                R.layout.fragment_bottom_shapes_dialog, container, false);
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        view.setBackgroundResource(R.drawable.bg_bottom_sheet);

        RecyclerView rvColor = view.findViewById(R.id.shapeColors);
        SeekBar sbOpacity = view.findViewById(R.id.shapeOpacity);
        SeekBar sbBrushSize = view.findViewById(R.id.shapeSize);
        RecyclerView rvShape = view.findViewById(R.id.rvShapeGroup);

        List<ToolModel> listTool = new ArrayList<>();
        listTool.add(new ToolModel("Brush", R.drawable.ic_brush, ToolType.BRUSH));
        listTool.add(new ToolModel("Line", R.drawable.ic_line, ToolType.LINE));
        listTool.add(new ToolModel("Arrow", R.drawable.ic_arrow, ToolType.ARROW));
        listTool.add(new ToolModel("Oval", R.drawable.ic_oval, ToolType.OVAL));
        listTool.add(new ToolModel("Rectangle", R.drawable.ic_rectangle, ToolType.RECTANGLE));
        EditingToolsAdapter editingToolsAdapter = new EditingToolsAdapter(this, listTool);

        LinearLayoutManager llmTools = new LinearLayoutManager(requireActivity(), LinearLayoutManager.HORIZONTAL, false);
        rvShape.setLayoutManager(llmTools);
        rvShape.setAdapter(editingToolsAdapter);

        sbOpacity.setOnSeekBarChangeListener(this);
        sbBrushSize.setOnSeekBarChangeListener(this);

        LinearLayoutManager layoutManager = new LinearLayoutManager(
                requireActivity(), LinearLayoutManager.HORIZONTAL, false);
        rvColor.setLayoutManager(layoutManager);
        // rvColor.setHasFixedSize(true);

        ColorPickerAdapter colorPickerAdapter = new ColorPickerAdapter(requireActivity());
        colorPickerAdapter.setOnColorPickerClickListener(colorCode -> {
            if (mProperties != null) {
                dismiss();
                mProperties.onColorChanged(colorCode);
            }
        });
        rvColor.setAdapter(colorPickerAdapter);
    }

    @Override
    public void onToolSelected(ToolType toolType) {
        switch (toolType) {
            case LINE:
                mProperties.onShapePicked(ShapeType.Line.INSTANCE);
                break;
            case ARROW:
                mProperties.onShapePicked(new ShapeType.Arrow());
                break;
            case OVAL:
                mProperties.onShapePicked(ShapeType.Oval.INSTANCE);
                break;
            case RECTANGLE:
                mProperties.onShapePicked(ShapeType.Rectangle.INSTANCE);
                break;
            default:
                mProperties.onShapePicked(ShapeType.Brush.INSTANCE);
                break;
        }
    }

    public void setPropertiesChangeListener(Properties properties) {
        mProperties = properties;
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
        if (mProperties != null) {
            switch (seekBar.getId()) {
                case R.id.shapeOpacity:
                    mProperties.onOpacityChanged(progress);
                    break;
                case R.id.shapeSize:
                    mProperties.onShapeSizeChanged(progress);
                    break;
            }
        }
    }

    @Override 
    public int getTheme() {
        return R.style.BottomSheetDialogTheme;
    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {
    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {
    }
}
