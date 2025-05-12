const flattenedResults = [];
    async function fetchAndPrepareData() {
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
              flattenedResults.push({
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

        downloadCSV(flattenedResults, 'discussion_posts_' + window.orgUnitId + '.csv');
      } catch (error) {
        console.error('Error fetching forum structure:', error);
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
    }

 window.onload = () => {
  const btn = document.createElement('button');
  btn.textContent = 'Download CSV';
  btn.id = 'downloadBtn';
  btn.onclick = async () => {
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Generating file...';

    try {
      await fetchAndPrepareData();
    } catch (error) {
      console.error('Error during file generation:', error);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  };
  document.body.appendChild(btn);
};
