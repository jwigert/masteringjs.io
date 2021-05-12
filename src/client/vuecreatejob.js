
// loads Jobs

// const server = "https://masteringjs-job-board.azurewebsites.net";
const server = "http://localhost:7071";
const payment = server+'/api/stripeCheckout';
var stripe = Stripe('pk_test_51IkuAqIFSwo5WpGWudAKEeemrymI6EmICEAgkgvlq4Bo5jJ1uuMRlrBRw9kvHH7boANqjE7Y6Mb7lQmsXRQoZo3x00Ek1L6d8A');

const app = new Vue({
  data: () => ({
    company: null,
    logo: null,
    title: null,
    location: 'Anywhere',
    sticky: false,
    description: null,
    url: null,
    instructions: null,
    email: null,
    feedback: null,
    invoiceAddress: null,
    invoiceNotes: null,
    tags: 'like,this',
    displayImage: true,
    previewImage: null,
    loading: false,
    isActive: false
  }),
  updated() {
    console.log(new Date(), 'State Change:', this.$data);
  },
  created() {
    window.addEventListener("keydown", this.shortcut);
  },
  destroyed() {
    window.removeEventListener("keydown", this.shortcut)
  },
  mounted() {
    window.$saveState = () => {
      console.log('I am save state');
      window.localStorage.setItem('__state', JSON.stringify(this.$data));
    };
    window.$loadState = () => {
      console.log('I am load state');
      const saved = JSON.parse(window.localStorage.getItem('__state'));
      if (!saved) {
        throw new Error('No saved data!');
      }
      Object.assign(this.$data, saved);
    };
    window.$clearState = () => {
      window.localStorage.setItem('__state', '');
    };
  },
  methods: {
    postJob() {
      this.loading = true;
      const tags = this.tags.split(",");
      axios.post(server + '/api/createJob', {
        company: this.company,
        logo: this.logo,
        title: this.title,
        location: this.location,
        email: this.email,
        tags: tags,
        sticky: this.sticky,
        description: marked(this.description),
        url: this.url,
        instructions: this.instructions,
        feedback: this.feedback,
        invoiceAddress: this.invoiceAddress,
        invoiceNotes: this.invoiceNotes,
      }).then(function(response) {
        return stripe.redirectToCheckout({sessionId:response.data.id});
      }).then(function(result) {
        if(result.error) {
          alert(result.error.message);
        }
      }).catch(function(error) {
        console.error('Error', error);
      });
    },
    shortcut(event) {
      if(event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        window.$saveState();
      }
      if(event.key === "o" && event.ctrlKey) {
        event.preventDefault();
        window.$loadState();
      }
      if(event.key === "e" && event.ctrlKey) {
        event.preventDefault();
        window.$clearState();
      }
    }
  },
  computed: {
    md() {
      if(this.description == null) return;
      return marked(this.description);
    },
    logoWithPlaceholder() {
      if (this.logo) {
        return this.logo;
      }
      return '/assets/logo.svg';
    },
    companyWithPlaceholder() {
      if (this.company) {
        return this.company;
      }
      return 'Placeholder, LLC';
    },
    titleWithPlaceholder() {
      if (this.title) {
        return this.title;
      }
      return 'Software Engineer 3.14';
    }
  },
  template: `
    <div>
    <div v-if="!loading">
      <h1>Hire JavaScript Developers</h1>
      <form action="" @submit.prevent="postJob()">
        <div>
          <label> Company Name </label>
          <input type="text" v-model="company" required placeholder="Placeholder, LLC" />
        </div>
        <div>
          <label> Job Title </label>
          <input type="text" v-model="title" required placeholder="Software Engineer 3.14" />
        </div>
        <div>
          <label> Location </label>
          <input type="text" v-model="location" required/>
        </div>
        <div>
          <label>Sticky your post for 30 days? Email masteringjs after 30 days to extend.</label>
          <input type="checkbox" v-model="sticky" />
        </div>
        <div>
          <div><label>Description</label></div>
          <textarea v-model="description" required>Enter Text Here</textarea>
        </div>
         <div>
        <div><label> Technical Skills(Comma separated values, no spaces) </label></div>
        <input type="text" v-model="tags" required />
         </div>
        <div>
          <div><label> Company Image </label></div>
          <h3 v-if="!displayImage">That file type is not supported</h3>
          <input type="url" v-model="logo" required/>
        </div>
        <div>
          <label> Apply URL </label>
          <input type="url" v-model="url" required/>
        </div>
        <div>
          <div><label> How To Apply </label></div>
          <textarea v-model="instructions" required>To Apply</textarea>
        </div>
        <div>
          <label> Company Email </label>
          <input type="email" v-model="email" required/>
        </div>
        <div>
          <div><label> Feedback </label></div>
          <textarea v-model="feedback">Type here</textarea>
        </div>
        <div>
          <label> Invoice Address </label>
          <input type="text" v-model="invoiceAddress" />
        </div>
        <div>
          <label> Invoice Notes </label>
          <input type="text" v-model="invoiceNotes" />
        </div>

        <h2>Preview</h2>

        <h4>Horizontal</h4>
        <div class="post job">
          <div class="company-logo">
            <img v-bind:src="logoWithPlaceholder" />
          </div>
          <div class="description">
            <div>{{companyWithPlaceholder}}</div>
            <a class="title">{{titleWithPlaceholder}}</a>
            <div>
              <div class="location">
                {{location}}
              </div>
            </div>
          </div>
          <div v-show="isActive">
          </div>
          <div class="apply-button">
            Apply
          </div>
        </div>

        <h4>Vertical</h4>
        <div id="jobs" class="job-listing" style="position: relative; top: 0px; right: 0px">
          <a v-bind:href="'/jobs'">
            <div class="company-logo">
              <img v-bind:src="logoWithPlaceholder" />
            </div>
            <div class="description">
              <div class="company">{{companyWithPlaceholder}}</div>
              <div class="title">{{titleWithPlaceholder}}</div>
              <div class="location">{{location}}</div>
            </div>
          </a>
        </div>

        <button id="checkout-button" type="submit">Submit</button>
      </form>
      </div>
      <div v-else>Loading...</div>
    </div>
  `,
});
app.$mount('#content');