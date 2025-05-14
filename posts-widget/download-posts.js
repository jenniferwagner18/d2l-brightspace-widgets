const allPosts = [];
async function fetchPosts() {
      try {
        const forums = await fetch('/d2l/api/le/1.75/'+ window.orgUnitId + '/discussions/forums/')
        .then(res => res.json());

        for (const forum of forums) {
          const forumId = forum.ForumId;
          const forumName = forum.Name;

          const topics = await fetch('/d2l/api/le/1.75/'+ window.orgUnitId + `/discussions/forums/${forumId}/topics/`)
          .then(res => res.json());

          if (!Array.isArray(topics)) continue;

          for (const topic of topics) {
            const topicId = topic.TopicId;
            const topicName = topic.Name;

            const posts = await fetch('/d2l/api/le/1.75/'+ window.orgUnitId + `/discussions/forums/${forumId}/topics/${topicId}/posts/`)
            .then(res => res.json());

            if (!Array.isArray(posts)) continue;

            posts.forEach(post => {
              allPosts.push({
                forumId,
                forumName,
                topicId,
                topicName,
                postId: post.PostId,
                subject: post.Subject,
                messageHtml: post.Message?.Html || '',
                author: post.PostingUserDisplayName,
                datePosted: post.DatePosted,
                isReply: post.ParentPostId !== null,
                parentPostId: post.ParentPostId,
                threadId: post.ThreadId,
                replyPostIds: post.ReplyPostIds,
                wordCount: post.WordCount,
                isAnonymous: post.IsAnonymous,
                isDeleted: post.IsDeleted,
              });
            });
          }
        }
        return allPosts;
      } catch (error) {
        console.error('Error fetching forum structure:', error);
        return [];
      }
    }

function downloadCSV(data, filename) {
      if (!data.length) {
        console.warn('No data to export');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];

      data.forEach(row => {
        const values = headers.map(header => {
          let val = row[header] ?? '';
          if (Array.isArray(val)) val = val.join(' | ');
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

window.onload = () => {
    const btn = document.createElement('button');
    btn.textContent = 'Download CSV';
    const message = document.createElement('div');
    message.style.color = '#8B0000';
    document.body.appendChild(btn);
    document.body.appendChild(message);

    btn.onclick = async () => {
        btn.disabled = true;
        btn.textContent = 'Generating file...';
        
    try {
      const coursePosts = await fetchPosts();

      if (coursePosts.length === 0) {
        message.textContent = 'No posts exist in course!';
      } else {
        downloadCSV(coursePosts, 'discussion_posts_' + window.orgUnitId + '.csv');
        message.textContent = 'Download successful!';
        message.style.color = 'green';
      }
    } catch (error) {
      console.error('Error during file generation:', error);
      message.textContent = 'Error generating file. Please try again.';
    } finally {
      btn.textContent = 'Download CSV';
      btn.disabled = false;
    }
  };
};
