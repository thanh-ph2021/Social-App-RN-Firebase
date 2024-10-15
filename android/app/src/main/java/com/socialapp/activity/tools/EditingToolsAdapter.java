package com.socialapp.activity.tools;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.socialapp.R;

import java.util.ArrayList;
import java.util.List;

public class EditingToolsAdapter extends RecyclerView.Adapter<EditingToolsAdapter.ViewHolder> {

    private List<ToolModel> mToolList;
    private OnItemSelected mOnItemSelected;
    private int mSelectedPosition = -1;

    public EditingToolsAdapter(OnItemSelected onItemSelected, List<ToolModel> toolList) {
        mOnItemSelected = onItemSelected;
        mToolList = toolList;
    }

    public interface OnItemSelected {
        void onToolSelected(ToolType toolType);
    }

    @NonNull
    @Override
    public EditingToolsAdapter.ViewHolder
    onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.row_editing_tools, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EditingToolsAdapter.ViewHolder holder, int position) {
        ToolModel item = mToolList.get(position);
        holder.txtTool.setText(item.getMToolName());
        holder.imgToolIcon.setImageResource(item.getMToolIcon());

        if (position == mSelectedPosition) {
            holder.txtTool.setTextColor(
                    holder.itemView.getContext().getResources().getColor(R.color.social_pink));
            holder.imgToolIcon.setColorFilter(
                    holder.itemView.getContext().getResources().getColor(R.color.social_pink));
        } else {
            // Màu mặc định cho item chưa được chọn
            holder.txtTool.setTextColor(
                    holder.itemView.getContext().getResources().getColor(R.color.white));
            holder.imgToolIcon.setColorFilter(
                    holder.itemView.getContext().getResources().getColor(R.color.white));
        }
    }

    @Override
    public int getItemCount() {
        return mToolList.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        ImageView imgToolIcon;
        TextView txtTool;

        @SuppressLint({"NotifyDataSetChanged"})
        ViewHolder(View itemView) {
            super(itemView);
            imgToolIcon = itemView.findViewById(R.id.imgToolIcon);
            txtTool = itemView.findViewById(R.id.txtTool);
            itemView.setOnClickListener(v -> {
                mSelectedPosition = getBindingAdapterPosition();
                notifyDataSetChanged();
                mOnItemSelected.onToolSelected(mToolList.get(getLayoutPosition()).getMToolType());
            });
        }
    }
}
