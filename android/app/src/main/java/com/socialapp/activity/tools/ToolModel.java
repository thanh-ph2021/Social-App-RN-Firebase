package com.socialapp.activity.tools;

public class ToolModel {
    private String mToolName;
    private int mToolIcon;
    private ToolType mToolType;

    public ToolModel(String toolName, int toolIcon, ToolType toolType) {
        mToolName = toolName;
        mToolIcon = toolIcon;
        mToolType = toolType;
    }

    public String getMToolName() {
        return mToolName;
    }

    public void setMToolName(String mToolName) {
        this.mToolName = mToolName;
    }

    public int getMToolIcon() {
        return mToolIcon;
    }

    public void setMToolIcon(int mToolIcon) {
        this.mToolIcon = mToolIcon;
    }

    public ToolType getMToolType() {
        return mToolType;
    }

    public void setMToolType(ToolType mToolType) {
        this.mToolType = mToolType;
    }
}
