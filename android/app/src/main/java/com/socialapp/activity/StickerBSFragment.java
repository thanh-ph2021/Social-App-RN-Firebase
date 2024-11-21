package com.socialapp.activity;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.socialapp.R;

public class StickerBSFragment extends BottomSheetDialogFragment {
    private StickerListener mStickerListener;

    public void setStickerListener(StickerListener stickerListener) {
        mStickerListener = stickerListener;
    }

    public interface StickerListener {
        void onStickerClick(Bitmap bitmap);
    }

    private final BottomSheetBehavior.BottomSheetCallback mBottomSheetBehaviorCallback = new BottomSheetBehavior.BottomSheetCallback() {
        @Override
        public void onStateChanged(@NonNull View bottomSheet, int newState) {
            if (newState == BottomSheetBehavior.STATE_HIDDEN) {
                dismiss();
            }
        }

        @Override
        public void onSlide(@NonNull View bottomSheet, float slideOffset) {
            // Do nothing
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

        CoordinatorLayout.LayoutParams params = (CoordinatorLayout.LayoutParams) ((View) contentView.getParent()).getLayoutParams();
        BottomSheetBehavior behavior = (BottomSheetBehavior) params.getBehavior();
        if (behavior != null && behavior instanceof BottomSheetBehavior) {
            behavior.setBottomSheetCallback(mBottomSheetBehaviorCallback);
        }
        ((View) contentView.getParent()).setBackgroundColor(getResources().getColor(android.R.color.transparent));

        RecyclerView rvEmoji = contentView.findViewById(R.id.rvEmoji);
        GridLayoutManager gridLayoutManager = new GridLayoutManager(getActivity(), 3);
        rvEmoji.setLayoutManager(gridLayoutManager);
        StickerAdapter stickerAdapter = new StickerAdapter();
        rvEmoji.setAdapter(stickerAdapter);
        // rvEmoji.setHasFixedSize(true);
        rvEmoji.setItemViewCacheSize(stickerPathList.length);
    }

    class StickerAdapter extends RecyclerView.Adapter<StickerAdapter.ViewHolder> {
        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.row_sticker, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            // Load sticker image from remote URL
            Glide.with(requireContext())
                    .asBitmap()
                    .load(stickerPathList[position])
                    .into(holder.imgSticker);
        }

        @Override
        public int getItemCount() {
            return stickerPathList.length;
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            ImageView imgSticker;

            ViewHolder(View itemView) {
                super(itemView);
                imgSticker = itemView.findViewById(R.id.imgSticker);

                itemView.setOnClickListener(v -> {
                    if (mStickerListener != null) {
                        Glide.with(requireContext())
                                .asBitmap()
                                .load(stickerPathList[getAdapterPosition()])
                                .into(new CustomTarget<Bitmap>(256, 256) {
                                    @Override
                                    public void onResourceReady(@NonNull Bitmap resource, Transition<? super Bitmap> transition) {
                                        mStickerListener.onStickerClick(resource);
                                    }

                                    @Override
                                    public void onLoadCleared(Drawable placeholder) {
                                        // Do nothing
                                    }
                                });
                    }
                    dismiss();
                });
            }
        }
    }

    // Image URLs from flaticon (https://www.flaticon.com/stickers-pack/food-289)
    private static final String[] stickerPathList = new String[]{
            "https://cdn-icons-png.flaticon.com/256/4392/4392452.png",
            "https://cdn-icons-png.flaticon.com/256/4392/4392455.png",
            "https://cdn-icons-png.flaticon.com/256/4392/4392459.png",
            "https://cdn-icons-png.flaticon.com/256/4392/4392462.png",
            "https://cdn-icons-png.flaticon.com/256/4392/4392465.png",
            "https://cdn-icons-png.flaticon.com/256/4392/4392467.png",
            "https://cdn-icons-png.flaticon.com/256/4392/4392469.png",
            "https://cdn-icons-png.flaticon.com/256/4392/4392471.png",
            "https://cdn-icons-png.flaticon.com/256/4392/4392522.png",
            "https://cdn-icons-png.flaticon.com/128/1828/1828884.png",
            "https://cdn-icons-png.flaticon.com/128/1139/1139982.png",
            "https://cdn-icons-png.flaticon.com/128/2936/2936758.png",
            "https://cdn-icons-png.flaticon.com/128/197/197386.png",
            "https://cdn-icons-png.flaticon.com/128/819/819814.png",
            "https://cdn-icons-png.flaticon.com/128/3075/3075977.png",
            "https://cdn-icons-png.flaticon.com/128/685/685842.png",
            "https://cdn-icons-png.flaticon.com/128/869/869869.png",
            "https://cdn-icons-png.flaticon.com/128/13717/13717095.png",
            "https://cdn-icons-png.flaticon.com/128/13717/13717634.png",
            "https://cdn-icons-png.flaticon.com/128/13716/13716969.png",
            "https://cdn-icons-png.flaticon.com/128/13716/13716882.png",
            "https://cdn-icons-png.flaticon.com/128/744/744546.png",
            "https://cdn-icons-png.flaticon.com/128/3792/3792011.png",
            "https://cdn-icons-png.flaticon.com/128/9004/9004824.png",
            "https://cdn-icons-png.flaticon.com/128/2242/2242537.png",
            "https://cdn-icons-png.flaticon.com/128/2368/2368010.png",
            "https://cdn-icons-png.flaticon.com/128/294/294370.png",
            "https://cdn-icons-png.flaticon.com/128/1140/1140033.png",
            "https://cdn-icons-png.flaticon.com/128/14697/14697130.png",
            "https://cdn-icons-png.flaticon.com/128/9555/9555966.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213661.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213704.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213713.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213512.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213515.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213540.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213546.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213536.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213600.png",
            "https://cdn-icons-png.flaticon.com/256/4213/4213551.png",
    };
}
