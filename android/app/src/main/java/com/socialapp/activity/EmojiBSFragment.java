package com.socialapp.activity;

import android.annotation.SuppressLint;
import android.app.Dialog;

import androidx.annotation.NonNull;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.socialapp.R;

import java.util.ArrayList;

public class EmojiBSFragment extends BottomSheetDialogFragment {
    private EmojiListener mEmojiListener;
    private ArrayList<String> emojisList = new ArrayList();

    public EmojiBSFragment(Context context){
        emojisList =  getEmojis(context);
    }

    public interface EmojiListener {
        void onEmojiClick(String emojiUnicode);
    }

    private final BottomSheetBehavior.BottomSheetCallback mBottomSheetBehaviorCallback =
            new BottomSheetBehavior.BottomSheetCallback() {
                @Override
                public void onStateChanged(@NonNull View bottomSheet, int newState) {
                    if (newState == BottomSheetBehavior.STATE_HIDDEN) {
                        dismiss();
                    }
                }

                @Override
                public void onSlide(@NonNull View bottomSheet, float slideOffset) {
                }
            };

    @SuppressLint("RestrictedApi")
    @Override
    public void setupDialog(@NonNull Dialog dialog, int style) {
        super.setupDialog(dialog, style);
        View contentView = View.inflate(
                getContext(),
                R.layout.fragment_bottom_sticker_emoji_dialog,
                null
        );
        dialog.setContentView(contentView);
        CoordinatorLayout.LayoutParams params =
                (CoordinatorLayout.LayoutParams) ((View) contentView.getParent()).getLayoutParams();
        BottomSheetBehavior behavior = (BottomSheetBehavior) params.getBehavior();
        if (behavior != null) {
            behavior.addBottomSheetCallback(mBottomSheetBehaviorCallback);
        }
        ((View) contentView.getParent())
                .setBackgroundColor(getResources().getColor(android.R.color.transparent));

        RecyclerView rvEmoji = contentView.findViewById(R.id.rvEmoji);
        GridLayoutManager gridLayoutManager = new GridLayoutManager(requireActivity(), 5);
        rvEmoji.setLayoutManager(gridLayoutManager);

        EmojiAdapter emojiAdapter = new EmojiAdapter();
        rvEmoji.setAdapter(emojiAdapter);
        rvEmoji.setHasFixedSize(true);
        rvEmoji.setItemViewCacheSize(emojisList.size());
    }

    public void setEmojiListener(EmojiListener emojiListener) {
        mEmojiListener = emojiListener;
    }

    private class EmojiAdapter extends RecyclerView.Adapter<EmojiAdapter.ViewHolder> {

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.row_emoji, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            holder.txtEmoji.setText(emojisList.get(position));
        }

        @Override
        public int getItemCount() {
            return emojisList.size();
        }

        private class ViewHolder extends RecyclerView.ViewHolder {
            TextView txtEmoji;

            ViewHolder(View itemView) {
                super(itemView);
                txtEmoji = itemView.findViewById(R.id.txtEmoji);
                itemView.setOnClickListener(v -> {
                    if (mEmojiListener != null) {
                        mEmojiListener.onEmojiClick(emojisList.get(getLayoutPosition()));
                    }
                    dismiss();
                });
            }
        }
    }

    public static ArrayList<String> getEmojis(Context context) {
         ArrayList<String> convertedEmojiList = new ArrayList<>();
        String[] emojiList = context.getResources().getStringArray(R.array.photo_editor_emoji);
         for (String emojiUnicode : emojiList) {
             convertedEmojiList.add(convertEmoji(emojiUnicode));
         }
         return convertedEmojiList;
    }

    private static String convertEmoji(String emoji) {
        try {
            int convertEmojiToInt = Integer.parseInt(emoji.substring(2), 16);
            return new String(Character.toChars(convertEmojiToInt));
        } catch (NumberFormatException e) {
            return "";
        }
    }

}