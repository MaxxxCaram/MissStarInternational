import instaloader

def download_all_videos(username):
    # Create an instance of Instaloader
    L = instaloader.Instaloader()
    
    try:
        # Login (optional, but recommended)
        # L.login("your_username", "your_password")
        
        # Get profile
        profile = instaloader.Profile.from_username(L.context, username)
        
        # Download all posts
        print(f"Downloading videos from {username}...")
        for post in profile.get_posts():
            # Check if post is a video
            if post.is_video:
                try:
                    # Download the video
                    L.download_post(post, target=f"videos/{username}")
                    print(f"Downloaded: {post.date}")
                except Exception as e:
                    print(f"Error downloading post {post.date}: {e}")
                    continue
        
        print("Download completed!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Replace with the Instagram username you want to download from
    INSTAGRAM_USERNAME = "missstarinternational"
    download_all_videos(INSTAGRAM_USERNAME) 